class Shop < ApplicationRecord

  # Callbacks
  after_create :set_owner_is_shopkeeper
  before_destroy :set_owner_is_not_shopkeeper
  
  # Relationships
  belongs_to :shopkeeper, class_name: 'User', foreign_key: 'shopkeeper_id', validate: true

  has_many :orders, dependent: :destroy
  has_many :items
  has_many :shop_categories_joins, dependent: :destroy
  has_many :shop_categories, through: :shop_categories_joins

  # Validation
  validates :name, :address, :siret, presence: true
  validates :name, :city, length: {in: 3..80 }
  validates :address, length: {in: 5..100}
  validates :description, length: {in: 5..800}

  validates :zip_code, format: {
    with: /\A(([0-8][0-9])|(9[0-5])|(2[ab]))[0-9]{3}\z/, 
    message: "Merci de rentrer un code postal français valide."
  }, presence: true
  validates :shopkeeper_id, uniqueness: true

  # scopes
  scope :select_active_shops, lambda { 
    where(is_active: true)
  }

  scope :filter_by_name, lambda { |keyword|
    where('lower(name) LIKE ? ', "%#{keyword.downcase}%")
  }

  scope :filter_by_description, lambda { |keyword|
    where('lower(description) LIKE ? ', "%#{keyword.downcase}%")
  }

  scope :filter_by_location, lambda { |location|
    where('lower(zip_code) LIKE ? OR lower(city) LIKE ?', "#{location.downcase}%", "%#{location.downcase}%")
  }

  scope :filter_by_categories, lambda { |categories|
    select{ |shop|
      !( shop.shop_categories.map{ |cat| cat.title } & categories.split(',') ).empty?
    }
  }

  def shop_creation_send
    ShopMailer.creation_confirmation(self).deliver_now
  end

  # methodes
  def self.search(params)
    shops = Shop.all.select_active_shops
    shops = shops.filter_by_name(params[:keyword]).or(shops.filter_by_description(params[:keyword])) if params[:keyword]
    shops = shops.filter_by_location(params[:location]) if params[:location]

    shops = shops.filter_by_categories(params[:categories]) if params[:categories]

    shops
  end

  private

  def set_owner_is_shopkeeper
    self.shopkeeper.profile.update(is_shopkeeper: true)
  end
  
  def set_owner_is_not_shopkeeper
    self.shopkeeper.profile.update(is_shopkeeper: false)
  end
end
